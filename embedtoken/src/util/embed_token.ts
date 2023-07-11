import axios from "axios";

interface EmbedTokenProps{
  id: string;
  reportType: string;
  name: string;
  webUrl: string;
  embedUrl: string;
  isOwnedByMe: boolean;
  datasetId: [];
}

export async function getEmbedUrl(accessToken: string, reportId: string): Promise<EmbedTokenProps> {
  const apiUrl = `https://api.powerbi.com/v1.0/myorg/reports/${reportId}`;

  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  try {
    const response = await axios.get(apiUrl, { headers });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter a URL de incorporação:', error);
    throw new Error('Erro ao obter a URL de incorporação do relatório.');
  }
}