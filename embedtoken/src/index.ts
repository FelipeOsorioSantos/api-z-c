import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { getEmbedUrl } from "./util/embed_token";
import { AuthenticationContext } from "adal-node";
import {getCompanyAccess } from "./util/access_caspio";
import bodyParser from "body-parser";

// readAll .env
dotenv.config()

// register app
const app = express();

// cors configuration
// const allowedOrigins = ['http://exemple.com'];
const options: cors.CorsOptions = {
  origin: true // if there is a list of cors change it to "allowedOrigins"
};
app.use(cors(options));

//bodyParse
app.use(bodyParser.json());

// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({ extended: false }))

app.post('/table', async (req, res) => {
  const company:string = req.body.company
  const access_token = await getCompanyAccess(company)
  return res.send(access_token);
})

// Generate access token for reports
app.post('/token', async (req, res) => {

  //GET DATA COMPANY
  const company:string = req.body.company
  const access_company = await getCompanyAccess(company)

  //DATA APLICATION
  const clientId = `${process.env.MICROSOFT_CLIENT_ID}`; 
  const resource = 'https://analysis.windows.net/powerbi/api'; 
  const reportId = access_company.id_relatorio.split(',');
  // const reportId = ['0cc4e6ad-dcfc-47fd-94fe-2eacf6edc8ac', '4fd8045a-8c49-4b68-ada3-a6a7562fa96e'];

  //AUTH
  const tenantId = `${process.env.MICROSOFT_TENANT_ID}`; 
  const authorityHostUrl = 'https://login.microsoftonline.com';
  const authorityUrl = `${authorityHostUrl}/${tenantId}`;

  //DATA USER
  const username = access_company.usuario_pbi;
  const password = access_company.senha_pbi;
  // const username = `${process.env.MICROSOFT_USERNAME}`;
  // const password = `${process.env.MICROSOFT_PASSWORD}`;

  //GET TOKEN
  const context = new AuthenticationContext(authorityUrl);
  context.acquireTokenWithUsernamePassword(resource, username, password, clientId, async (err:any, tokenResponse:any) => {
    if (err) {
      console.error('Erro ao obter o token de acesso:', err);
      res.status(500).send('Erro ao obter o token de acesso.');
    } else {
      const accessToken = tokenResponse;

      const embedToken = await getEmbedUrl(accessToken.accessToken, reportId)

      const data = {
        token: accessToken.accessToken,
        values: embedToken.value,
      }

      res.send({ 
        data
       });
    }
  })
})

// Generate access token for reports using secretkey
app.get('/token_scr', async (req, res) => {
  // GET DATA COMPANY
  // const company = req.body.company;
  // const access_token = await getCompanyAccess(company);
  
  // DATA APPLICATION
  const clientSecret = `${process.env.MICROSOFT_CLIENT_SECRET_KEY}`;
  const clientId = `${process.env.MICROSOFT_CLIENT_ID}`;
  const resource = 'https://analysis.windows.net/powerbi/api';
  const reportId = `${process.env.MICROSOFT_REPORT_ID}`;

  // AUTH
  const tenantId = process.env.MICROSOFT_TENANT_ID;
  const authorityHostUrl = 'https://login.microsoftonline.com';
  const authorityUrl = `${authorityHostUrl}/${tenantId}`;

  // GET TOKEN
  const context = new AuthenticationContext(authorityUrl);
  context.acquireTokenWithClientCredentials(resource, clientId, clientSecret, async (err:any, tokenResponse:any) => {
    if (err) {
      console.error('Erro ao obter o token de acesso:', err);
      res.status(500).send('Erro ao obter o token de acesso.');
    } else {
      const accessToken = tokenResponse;

      const data = {
        token: accessToken,
      };

      res.send({
        data
      });
    }
  });
});


app.listen(8080, ()=> console.log("listening on port 8080"));