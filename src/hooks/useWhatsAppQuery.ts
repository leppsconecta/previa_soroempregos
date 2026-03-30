import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchChats, fetchMessages, sendText, sendMedia, editMessage, deleteMessageForEveryone, markChatAsRead } from '../services/whatsappApi';

export const useWhatsAppChats = (instanceName: string | null, apiKey?: string) => {
  return useQuery({
    queryKey: ['whatsapp-chats', instanceName, apiKey],
    queryFn: async () => {
      if (!instanceName) return [];
      const data = await fetchChats(instanceName, apiKey);
      console.log('WA Chats API Response:', data);
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.chats)) return data.chats;
      return [];
    },
    enabled: !!instanceName,
    // refetchInterval: 30000,
  });
};

export const useWhatsAppMessages = (instanceName: string | null, remoteJid: string | null, apiKey?: string) => {
  return useQuery({
    queryKey: ['whatsapp-messages', instanceName, remoteJid, apiKey],
    queryFn: async () => {
      if (!instanceName || !remoteJid) return [];
      const data = await fetchMessages(instanceName, remoteJid, apiKey);
      console.log('WA Messages API Response:', data);
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.messages)) return data.messages;
      if (Array.isArray(data?.messages?.records)) return data.messages.records;
      if (Array.isArray(data?.records)) return data.records;
      return [];
    },
    enabled: !!instanceName && !!remoteJid,
    // refetchInterval: 15000,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
     mutationFn: async ({ instanceName, remoteJid, text, type, mediaBase64, fileName, apiKey, quotedMsgId }: any) => {
       if (type === 'text') {
         return sendText(instanceName, remoteJid, text, quotedMsgId, apiKey);
       } else if (type === 'audio') {
         return sendMedia(instanceName, remoteJid, mediaBase64, 'audio', undefined, apiKey, quotedMsgId);
       } else if (type === 'file') {
         return sendMedia(instanceName, remoteJid, mediaBase64, 'document', fileName, apiKey, quotedMsgId);
       }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-messages', variables.instanceName, variables.remoteJid, variables.apiKey] });
      queryClient.invalidateQueries({ queryKey: ['whatsapp-chats', variables.instanceName, variables.apiKey] });
    }
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ instanceName, remoteJid, messageId, participant, apiKey }: any) => {
      return deleteMessageForEveryone(instanceName, remoteJid, messageId, participant, apiKey);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-messages', variables.instanceName, variables.remoteJid, variables.apiKey] });
    }
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ instanceName, remoteJid, apiKey }: { instanceName: string; remoteJid: string; apiKey?: string }) => {
      return markChatAsRead(instanceName, remoteJid, apiKey);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-chats', variables.instanceName, variables.apiKey] });
    }
  });
};
