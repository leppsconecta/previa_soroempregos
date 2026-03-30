const API_URL = 'https://api.leppsconecta.com.br';
const API_KEY = '4b4d12a7-8600-44e6-b344-c111c042ffe6';

const request = async (endpoint: string, options: RequestInit & { apiKey?: string } = {}) => {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'apikey': options.apiKey || API_KEY,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};


export const fetchChats = async (instanceName: string, apiKey?: string) => {
  return request(`/chat/findChats/${instanceName}`, {
    method: 'POST',
    body: JSON.stringify({}),
    apiKey
  });
};

export const fetchMessages = async (instanceName: string, remoteJid: string, apiKey?: string) => {
  return request(`/chat/findMessages/${instanceName}`, {
    method: 'POST',
    body: JSON.stringify({ where: { key: { remoteJid } } }),
    apiKey
  });
};

export const sendText = async (instanceName: string, remoteJid: string, text: string, quotedMessageId?: string, apiKey?: string) => {
  const payload: any = {
    number: remoteJid,
    text: text,
    delay: 1200,
    linkPreview: true
  };
  
  if (quotedMessageId) {
    payload.quoted = { key: { id: quotedMessageId } };
  }
  
  return request(`/message/sendText/${instanceName}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    apiKey
  });
};

export const sendMedia = async (instanceName: string, remoteJid: string, mediaBase64: string, mediatype: 'audio' | 'document' | 'image' | 'video', fileName?: string, apiKey?: string, quotedMessageId?: string) => {
  const payload: any = {
    number: remoteJid,
    mediatype: mediatype,
    media: mediaBase64,
    delay: 1200
  };

  if (fileName) {
    payload.fileName = fileName;
  }

  if (quotedMessageId) {
    payload.quoted = { key: { id: quotedMessageId } };
  }
  
  return request(`/message/sendMedia/${instanceName}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    apiKey
  });
};

export const editMessage = async (instanceName: string, remoteJid: string, messageId: string, text: string, apiKey?: string) => {
    const payload = {
        number: remoteJid,
        messageId: messageId,
        textMessage: {
            text: text
        }
    }
    return request(`/message/edit/${instanceName}`, {
        method: 'POST',
        body: JSON.stringify(payload),
        apiKey
    });
}

export const deleteMessage = async (instanceName: string, remoteJid: string, messageId: string, isGroup: boolean = false, apiKey?: string) => {
    return request(`/message/deleteMessage/${instanceName}`, {
        method: 'POST',
        body: JSON.stringify({
             messageId: messageId,
             number: remoteJid,
        }),
        apiKey
    });
}

export const deleteMessageForEveryone = async (instanceName: string, remoteJid: string, messageId: string, participant?: string, apiKey?: string) => {
    return request(`/chat/deleteMessageForEveryone/${instanceName}`, {
        method: 'DELETE',
        body: JSON.stringify({
             id: messageId,
             remoteJid: remoteJid,
             fromMe: true,
             participant: participant
        }),
        apiKey
    });
}

export const markChatAsRead = async (instanceName: string, remoteJid: string, apiKey?: string) => {
    return request(`/chat/markChatAsRead/${instanceName}`, {
        method: 'POST',
        body: JSON.stringify({
            number: remoteJid,
            readByParticipant: true
        }),
        apiKey
    });
}

export const checkWhatsAppNumber = async (instanceName: string, number: string, apiKey?: string) => {
  return request(`/chat/whatsappNumbers/${instanceName}`, {
    method: 'POST',
    body: JSON.stringify({ numbers: [number] }),
    apiKey
  });
};

export const getBase64FromMediaMessage = async (instanceName: string, messageObj: any, apiKey?: string) => {
  return request(`/chat/getBase64FromMediaMessage/${instanceName}`, {
    method: 'POST',
    body: JSON.stringify({ message: messageObj }),
    apiKey
  });
};

export default { request };
