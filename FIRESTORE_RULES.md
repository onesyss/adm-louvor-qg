# 🔒 Regras de Segurança do Firestore

## ⚠️ PROBLEMA: Não consegue deletar escalas

Se você não consegue deletar escalas, pode ser um problema de **permissões do Firestore**.

---

## ✅ **SOLUÇÃO: Verificar Regras do Firestore**

### **1️⃣ Acesse o Firebase Console:**

1. Vá em: https://console.firebase.google.com
2. Selecione seu projeto: **qg-workship**
3. Vá em: **Firestore Database** (menu lateral)
4. Clique na aba: **Rules** (Regras)

---

### **2️⃣ Verifique as regras atuais:**

Você deve ver algo assim:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

✅ **Se estiver assim, está CORRETO** (permite leitura e escrita para todos)

---

### **3️⃣ Se estiver diferente, substitua por:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir tudo durante desenvolvimento
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **ATENÇÃO:** Essas regras são **públicas** (qualquer pessoa pode ler/escrever). 
Use apenas durante desenvolvimento! Em produção, adicione autenticação.

---

### **4️⃣ Clique em "Publish" (Publicar)**

Aguarde alguns segundos para as regras serem aplicadas.

---

### **5️⃣ Teste novamente**

1. Recarregue a página do seu app
2. Tente deletar uma escala
3. Deve funcionar!

---

## 🔍 **Verificar se o erro é de permissão:**

Abra o **Console do navegador** e procure por erros como:

```
❌ FirebaseError: Missing or insufficient permissions
❌ PERMISSION_DENIED: Missing or insufficient permissions
```

Se aparecer esse erro, o problema é **permissão do Firestore**.

---

## 📊 **Regras Recomendadas para Produção:**

Depois que tudo funcionar, substitua por regras mais seguras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura pública
    match /{document=**} {
      allow read: if true;
    }
    
    // Apenas usuários autenticados podem escrever
    match /{document=**} {
      allow write: if request.auth != null;
    }
  }
}
```

Isso permite que qualquer pessoa **leia** os dados, mas apenas usuários **logados** podem **criar/editar/deletar**.

