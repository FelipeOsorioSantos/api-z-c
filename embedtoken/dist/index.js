"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adal_node_1 = require("adal-node");
const express_1 = __importDefault(require("express"));
const embed_token_1 = require("./util/embed_token");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// readAll .env
dotenv_1.default.config();
// register app
const app = (0, express_1.default)();
// cors configuration
// const allowedOrigins = ['http://exemple.com'];
const options = {
    origin: true // if there is a list of cors change it to "allowedOrigins"
};
app.use((0, cors_1.default)(options));
app.get('/', (req, res) => {
    return res.send("Welcome to the powerbi token generation API");
});
// Generate access token for reports
app.get('/token', (req, res) => {
    //DATA APLICATION
    console.log(`${process.env.MICROSOFT_CLIENT_ID}`);
    const clientId = `${process.env.MICROSOFT_CLIENT_ID}`;
    const resource = 'https://analysis.windows.net/powerbi/api';
    const reportId = `${process.env.MICROSOFT_REPORT_ID}`;
    //AUTH
    const tenantId = `${process.env.MICROSOFT_TENANT_ID}`;
    const authorityHostUrl = 'https://login.microsoftonline.com';
    const authorityUrl = `${authorityHostUrl}/${tenantId}`;
    //DATA USER
    const username = `${process.env.MICROSOFT_USERNAME}`;
    const password = `${process.env.MICROSOFT_PASSWORD}`;
    //GET TOKEN
    const context = new adal_node_1.AuthenticationContext(authorityUrl);
    context.acquireTokenWithUsernamePassword(resource, username, password, clientId, (err, tokenResponse) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error('Erro ao obter o token de acesso:', err);
            res.status(500).send('Erro ao obter o token de acesso.');
        }
        else {
            const accessToken = tokenResponse;
            const embedToken = yield (0, embed_token_1.getEmbedUrl)(accessToken.accessToken, reportId);
            const data = {
                token: accessToken.accessToken,
                embedToken: embedToken.embedUrl,
                id: embedToken.id
            };
            res.send({
                data
            });
        }
    }));
});
app.listen(8080, () => console.log("listening on port 8080"));
