# 🚀 Guia de Deploy - Netlify

## ✅ Checklist Pré-Deploy

Antes de fazer o deploy, certifique-se de que:

- [x] `netlify.toml` está na raiz do projeto
- [x] Firebase config está configurado em `src/firebase/config.ts`
- [x] Todas as dependências estão instaladas (`npm install`)
- [x] Build local funciona (`npm run build`)

## 📋 Configuração Firebase no Console

### 1. Authentication (Email/Password)
```
Console Firebase → Authentication → Sign-in method
→ Ativar "Email/Password"
→ Criar usuário: qgworkship@gmail.com / qg2025adoracao
```

### 2. Firestore Database
```
Console Firebase → Firestore Database
→ Guia "Rules" → Colar as regras:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}

→ Publish
```

### 3. Collections (serão criadas automaticamente)
- `musicians`
- `songs`
- `agendaItems`
- `schedules`
- `repertoires`
- `activities`

## 🌐 Deploy no Netlify

### Método 1: Deploy via Git (Recomendado)

1. **Push para GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for deploy"
   git push origin main
   ```

2. **Conectar no Netlify**
   - Acesse: https://app.netlify.com
   - New site → Import an existing project
   - Escolha seu provedor Git (GitHub/GitLab/Bitbucket)
   - Selecione o repositório `qg-worship`

3. **Configurações de Build** (automáticas via netlify.toml)
   ```
   Build command: npm run build
   Publish directory: dist
   Node version: 20
   ```

4. **Deploy**
   - Clique em "Deploy site"
   - Aguarde 2-3 minutos
   - ✅ Site no ar!

### Método 2: Deploy Manual via CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build local
npm run build

# Deploy
netlify deploy --prod
```

## 🔧 Troubleshooting

### Erro: "Command failed with exit code 2"

**Causa**: Build do TypeScript falhando

**Solução**:
```bash
# Rodar build localmente para ver o erro específico
npm run build

# Se der erro de TypeScript, verificar:
# 1. Todos os tipos estão corretos
# 2. Imports estão corretos
# 3. Firebase está instalado
npm install firebase
```

### Erro: "Module not found: firebase/firestore"

**Causa**: Firebase não instalado

**Solução**:
```bash
npm install firebase
git add package.json package-lock.json
git commit -m "Add firebase dependency"
git push
```

### Erro: "onAuthStateChanged is not a function"

**Causa**: Import incorreto do Firebase Auth

**Solução**: Verificar se o import está correto:
```typescript
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
```

### Build funciona local mas falha no Netlify

**Causa**: Node version diferente

**Solução**: O `netlify.toml` já define Node 20. Se persistir:
```toml
# netlify.toml
[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"
```

### Página 404 ao navegar (rotas quebradas)

**Causa**: SPA não configurado

**Solução**: O `netlify.toml` já tem o redirect. Se não funcionar:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🔐 Variáveis de Ambiente (Opcional)

Se quiser separar configurações dev/prod:

### No Netlify:
```
Site settings → Environment variables → Add variable

VITE_FIREBASE_API_KEY = AIzaSyCufYxGje83hdeWpOmaFczzgQO4sAQBhXs
VITE_FIREBASE_AUTH_DOMAIN = qg-workship.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = qg-workship
VITE_FIREBASE_STORAGE_BUCKET = qg-workship.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 893794036853
VITE_FIREBASE_APP_ID = 1:893794036853:web:2774e757369e17c8a3dc3c
```

**Nota**: Não é obrigatório, pois o código já tem fallback para os valores hardcoded.

## ✅ Checklist Pós-Deploy

Após o deploy, teste:

- [ ] Site carrega corretamente
- [ ] Navegação entre páginas funciona
- [ ] Login funciona (email/senha)
- [ ] Área admin está protegida
- [ ] Colaboradores aparecem
- [ ] Escalas aparecem
- [ ] Agenda aparece
- [ ] Repertório aparece
- [ ] Acervo musical aparece
- [ ] Adicionar/Editar/Deletar funciona (admin)
- [ ] Logout funciona
- [ ] Sessão persiste ao recarregar

## 📊 Monitoramento

### Ver Logs de Deploy:
```
Netlify Dashboard → Deploys → [Último deploy] → Deploy log
```

### Ver Logs em Tempo Real:
```
Netlify Dashboard → Deploys → [Site ativo] → Functions log
```

### Firebase Console:
```
https://console.firebase.google.com
→ Authentication (ver usuários logados)
→ Firestore (ver dados salvos)
→ Usage (monitorar quota)
```

## 🎯 Próximos Passos

Após deploy bem-sucedido:

1. ✅ Fazer login com `qgworkship@gmail.com`
2. ✅ Adicionar colaboradores reais
3. ✅ Criar escalas do mês
4. ✅ Adicionar repertórios
5. ✅ Cadastrar músicas no acervo
6. ✅ Configurar eventos na agenda
7. 🔒 Migrar dados do localStorage para Firestore (botão no admin)

## 🆘 Suporte

Se continuar com problemas:

1. Verificar logs no Netlify: `Deploy log`
2. Verificar console do navegador: `F12 → Console`
3. Verificar Firebase Console: `Authentication` e `Firestore`
4. Rodar build local: `npm run build` e ver erro específico

---

**Última atualização**: Configurado com Node 20, Firebase 12.3.0, Vite 7.1.9

