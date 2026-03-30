import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Message, MessageContentType, MOCK_ME_ID } from '../components/chat/types';

export const useWhatsAppRealtime = (chatId: string | string[] | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const mapRowToMessage = useCallback((row: any): Message => {
    // Basic type mapping
    let contentType: MessageContentType = 'text';
    const type = row.message_type;
    
    if (type === 'audioMessage') contentType = 'audio';
    else if (type === 'imageMessage') contentType = 'image';
    else if (type === 'videoMessage') contentType = 'video';
    else if (type === 'documentMessage') contentType = 'file';
    else if (type === 'reactionMessage') contentType = 'reaction';

    // Status handling
    const isDeleted = row.status === 'deletada_pelo_usuario';

    return {
      id: row.message_id || row.id,
      conversationId: row.chat_id,
      senderId: row.from_me ? MOCK_ME_ID : (row.sender_jid || 'unknown'),
      senderName: row.sender_name || '',
      content: row.content || '',
      contentType,
      createdAt: new Date(row.created_at),
      status: row.status,
      replyToId: row.reply_to_id,
      audioDuration: row.seconds,
      fileLength: row.file_length,
      rawMessage: row
    };
  }, []);

  const fetchInitialMessages = useCallback(async () => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    const idArray = Array.isArray(chatId) ? chatId : [chatId];
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_backup_message')
        .select('*')
        .in('chat_id', idArray)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (data) {
        const allMapped: Message[] = data.map(mapRowToMessage);
        
        // Separate reactions from messages
        const reactions = allMapped.filter(m => m.contentType === 'reaction');
        const regularMessages = allMapped.filter(m => m.contentType !== 'reaction').reverse();

        // Apply reactions to regular messages
        const messagesWithReactions = regularMessages.map(m => {
          const messageReactions: Record<string, string> = {};
          reactions.forEach(r => {
            if (r.replyToId === m.id) {
              messageReactions[r.content] = r.senderName || '';
            }
          });
          return { ...m, reactions: Object.keys(messageReactions).length > 0 ? messageReactions : undefined };
        });

        setMessages(messagesWithReactions);
      }
    } catch (err) {
      console.error('Error fetching initial messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [chatId, mapRowToMessage]);

  useEffect(() => {
    fetchInitialMessages();

    if (!chatId) return;

    const idArray = Array.isArray(chatId) ? chatId : [chatId];

    // Supabase Realtime Subscription
    const channel = supabase
      .channel(`chat:${idArray.join(',')}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'whatsapp_backup_message',
        },
        (payload) => {
          const raw = (payload.new || payload.old) as any;
          if (!raw || !idArray.includes(raw.chat_id)) return;

          if (payload.eventType === 'INSERT') {
            const raw = payload.new;
            const newMessage = mapRowToMessage(raw);
            
            if (newMessage.contentType === 'reaction') {
              // Handle reaction: find target message and update its reactions field
              setMessages((prev) => 
                prev.map((m) => {
                  if (m.id === newMessage.replyToId) {
                    const reactions = { ...(m.reactions || {}) };
                    reactions[newMessage.content] = newMessage.senderName;
                    return { ...m, reactions };
                  }
                  return m;
                })
              );
              return; // Do not add reaction as a separate message
            }

            setMessages((prev) => {
              if (prev.some(m => m.id === newMessage.id)) return prev;
              const next = [...prev, newMessage];
              // Keep it sorted ASC
              return next.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime());
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedRow = payload.new;
            const updatedMessage = mapRowToMessage(updatedRow);

            setMessages((prev) => 
              prev.map((m) => (m.id === updatedMessage.id ? { ...m, ...updatedMessage } : m))
            );
          } else if (payload.eventType === 'DELETE') {
             setMessages((prev) => prev.filter(m => m.id !== payload.old.message_id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, fetchInitialMessages, mapRowToMessage]);

  return { messages, setMessages, isLoading };
};
