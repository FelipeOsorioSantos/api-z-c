import axios from "axios";

interface IAccessCaspioTable{
  PK_ID: number,
  empresa: string,
  id_relatorio: string,
  usuario_pbi: string,
  senha_pbi: string
}

interface IAccessCaspio{
  access_token: string,
  token_type: string,
  expires_in: number,
  refresh_token: string,
}

export async function getAccessTokenCaspio(): Promise<IAccessCaspio> {

  const clientId = `${process.env.CASPIO_CLIENT_ID}`;
  const clientSecret = `${process.env.CASPIO_CLIENT_SECRET}`;

  const data = `grant_type=client_credentials&
                client_id=${clientId}&
                client_secret=${clientSecret}`;

  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  
  try {
    const response = await axios.post('https://c2aca196.caspio.com/oauth/token', data, config)
    return response.data
  } catch (error) {
    console.error('Erro ao se autenticar com a API do Caspio:', error)
    throw new Error('Erro ao se autenticar com a API do Caspio.');
  }
  
}


export async function getCompanyAccess(company:string): Promise<IAccessCaspioTable> {

  if(!company){
    throw new Error('Empresa não foi passada.');
  }

  const accessCaspio = await getAccessTokenCaspio()

  const apiUrl = `https://c2aca196.caspio.com/rest/v2/tables/tb_de_para_projeto_relatorio/records?q.where=empresa='${company}'`;

  const headers = {
    Authorization: `Bearer ${accessCaspio.access_token}`
  };

  try {
    const response = await axios.get(apiUrl, { headers });
    return response.data.Result[0];
  } catch (error) {
    console.error('Erro ao obter os dados da empresa:', error);
    throw new Error('Erro ao obter os dados da empresa.');
  } 
}