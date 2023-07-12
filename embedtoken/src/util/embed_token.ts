import axios from "axios";

interface IValuesEmbedToken{
  value: IEmbedToken[]
}

interface IEmbedToken{
  id: string;
  reportType: string;
  name: string;
  webUrl: string;
  embedUrl: string;
  isOwnedByMe: boolean;
  datasetId: [];
}

export async function getEmbedUrl(accessToken: string, reportId: string[]): Promise<IValuesEmbedToken> {

  const apiUrl = `https://api.powerbi.com/v1.0/myorg/reports?$filter=`;
  const filter = reportId.map(id => `id eq '${id}'`).join(' or ');
  const finalUrl = apiUrl + filter;

  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  try {
    const response = await axios.get(finalUrl, { headers });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter a URL de incorporação:', error);
    throw new Error('Erro ao obter a URL de incorporação do relatório.');
  }
}