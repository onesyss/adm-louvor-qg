# 🚀 Configuração do Netlify

## ⚠️ PROBLEMA: Dados somem após deploy no Netlify

**Causa:** As variáveis de ambiente do Firebase não estão configuradas no Netlify.

---

## ✅ SOLUÇÃO: Configurar Variáveis de Ambiente

### 1️⃣ **Acesse o Painel do Netlify:**

1. Vá em: https://app.netlify.com
2. Clique no seu site: **qg-worship**
3. Vá em: **Site settings** → **Environment variables**

---

### 2️⃣ **Adicione as Variáveis de Ambiente:**

Clique em **Add a variable** e adicione CADA UMA destas variáveis:

```
VITE_FIREBASE_API_KEY
Valor: AIzaSyCufYxGje83hdeWpOmaFczzgQO4sAQBhXs

VITE_FIREBASE_AUTH_DOMAIN
Valor: qg-workship.firebaseapp.com

VITE_FIREBASE_PROJECT_ID
Valor: qg-workship

VITE_FIREBASE_STORAGE_BUCKET
Valor: qg-workship.firebasestorage.app

VITE_FIREBASE_MESSAGING_SENDER_ID
Valor: 893794036853

VITE_FIREBASE_APP_ID
Valor: 1:893794036853:web:2774e757369e17c8a3dc3c
```

---

### 3️⃣ **Limpar Cache e Redeployar:**

1. Vá em: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

---

### 4️⃣ **Verificar no Console do Navegador:**

Após o deploy, abra o site e veja no console:

```
🔥 Firebase Config:
  - Project ID: qg-workship
  - Auth Domain: qg-workship.firebaseapp.com
  - Usando variáveis de ambiente? true  ← DEVE SER TRUE!
```

Se aparecer `false`, as variáveis não foram configuradas corretamente.

---

## 🔧 **Alternativa: Usar apenas valores hardcoded**

Se você NÃO quer usar variáveis de ambiente (menos seguro, mas mais simples):

1. As credenciais já estão no código (`src/firebase/config.ts`)
2. Não precisa fazer nada
3. Mas pode ter problemas de cache

**Nesse caso:**
- Limpe o cache do Netlify: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

---

## 📊 **Debug: Ver logs no Console**

Após configurar, recarregue o site do Netlify e veja no console:

```
🔥 Firebase Config:
  - Project ID: qg-workship
  - Usando variáveis de ambiente? true

📡 Iniciando onSnapshot para repertoires...
🔔 onSnapshot detectou mudança em repertoires: X documentos
✅ Dados de repertoires atualizados: X documentos
```

Se não aparecer, há algum erro. Me mostre o console!

---

## ❓ **Ainda não funciona?**

Possíveis problemas:

1. **Cache do navegador:** Force refresh (Ctrl + Shift + R)
2. **Build antigo:** Limpe cache do Netlify
3. **Regras do Firestore:** Verifique as regras de segurança
4. **CORS:** Verifique se o domínio do Netlify está autorizado no Firebase

---

## 📝 **Checklist:**

- [ ] Variáveis de ambiente configuradas no Netlify
- [ ] Cache do Netlify limpo
- [ ] Deploy realizado com sucesso
- [ ] Console mostra "Usando variáveis de ambiente? true"
- [ ] Console mostra "onSnapshot detectou mudança em repertoires"
- [ ] Dados aparecem na interface
- [ ] Dados persistem após reload

