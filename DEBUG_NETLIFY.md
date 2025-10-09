# 🐛 Debug - Comparação Local vs Netlify

## 🔍 **Como Identificar a Diferença:**

### ✅ **Local (Funciona):**

Quando você roda `npm run dev` localmente:

```
🔥 Firebase Config:
  - Project ID: qg-workship
  - Auth Domain: qg-workship.firebaseapp.com
  - Usando variáveis de ambiente? false  ← Usa valores hardcoded

📡 Iniciando onSnapshot para repertoires...
🔔 onSnapshot detectou mudança em repertoires: 5 documentos
✅ Repertoire adicionado com ID: abc123
```

✅ **Dados persistem após reload**

---

### ❌ **Netlify (Não Funciona):**

No site do Netlify:

**Problema 1: Variáveis de Ambiente Ausentes**
```
🔥 Firebase Config:
  - Project ID: qg-workship
  - Usando variáveis de ambiente? false

📡 Iniciando onSnapshot para repertoires...
❌ Erro no onSnapshot de repertoires: FirebaseError: ...
```

**Problema 2: Build Antigo (Cache)**
```
🔥 Firebase Config:
  - (não aparece nenhum log)

📡 Iniciando onSnapshot...
  - (não aparece nenhum log)
```

❌ **Dados não aparecem OU somem após reload**

---

## 🎯 **Ações Necessárias:**

### 1️⃣ **Limpar Cache do Netlify:**

Isso força o Netlify a fazer um build novo com o código atualizado:

1. Vá em: https://app.netlify.com
2. Clique no seu site: **qg-worship**
3. Vá em: **Deploys**
4. Clique em: **Trigger deploy** → **Clear cache and deploy site**

---

### 2️⃣ **Configurar Variáveis de Ambiente (Opcional):**

Se quiser usar variáveis de ambiente (mais seguro):

1. Vá em: **Site settings** → **Environment variables**
2. Adicione as variáveis do arquivo `NETLIFY_CONFIG.md`
3. Faça um novo deploy

---

### 3️⃣ **Verificar Console:**

Após o deploy, abra o site do Netlify e:

1. Pressione **F12** para abrir o console
2. Recarregue a página (**Ctrl + Shift + R** para limpar cache do navegador)
3. Veja os logs:

**✅ CORRETO:**
```
🔥 Firebase Config:
  - Project ID: qg-workship
  
📡 Iniciando onSnapshot para schedules...
🔔 onSnapshot detectou mudança em schedules: X documentos

📡 Iniciando onSnapshot para repertoires...
🔔 onSnapshot detectou mudança em repertoires: X documentos
```

**❌ ERRADO:**
```
(nenhum log aparece)
OU
❌ Erro no onSnapshot de repertoires: ...
```

---

## 📊 **Diferenças entre Local e Netlify:**

| Aspecto | Local (Dev) | Netlify (Prod) |
|---------|-------------|----------------|
| **Build** | `npm run dev` | `npm run build` |
| **Vite Mode** | Development | Production |
| **Hot Reload** | ✅ Sim | ❌ Não |
| **Source Maps** | ✅ Sim | ⚠️ Minificado |
| **Cache** | ❌ Não | ✅ Sim (pode causar problemas) |
| **Env Vars** | Lê do código | Precisa configurar no painel |

---

## 🔧 **Solução Rápida (Sem Variáveis de Ambiente):**

Como as credenciais já estão no código (`src/firebase/config.ts`), você pode simplesmente:

1. **Limpar cache do Netlify**
2. **Forçar novo build**
3. **Limpar cache do navegador** (Ctrl + Shift + R)

Isso deve fazer funcionar!

---

## ⚠️ **Se Ainda Não Funcionar:**

Me mostre o console completo do Netlify com:

1. Todos os logs de `🔥 Firebase Config`
2. Todos os logs de `📡 Iniciando onSnapshot`
3. Todos os logs de `❌ Erro`
4. Logs quando você tenta adicionar um repertório

Vou poder identificar exatamente o problema! 🔍

