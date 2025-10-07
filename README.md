# QG WORSHIP - Ministério de Louvor

Um sistema completo para gerenciamento de escalas, repertórios e eventos do ministério de louvor.

## 🎵 Funcionalidades

### 📋 Escalas Mensais
- Visualização de escalas organizadas por mês e ano
- Divisão em 4 semanas por mês
- Gerenciamento de músicos por instrumento (Baixo, Bateria, Guitarra, Teclado)
- Atribuição de vocais para cada música
- Espaços para música da oferta e ofertório

### 📅 Agenda
- Organização de eventos, ensaios e reuniões
- Filtros por tipo de evento
- Informações detalhadas (data, hora, local)
- Visualização de próximos eventos

### 🎼 Repertório da Semana
- Músicas e vocais da semana atual
- Links para YouTube e Spotify
- Informações técnicas (tom, BPM)
- Tags para categorização

### 🗃️ Acervo Musical
- Todas as músicas já tocadas no ministério
- Sistema de busca e filtros
- Categorização por tags
- Links para streaming

### ⚙️ Área Administrativa
- Gerenciamento de músicos
- Adição de novas músicas
- Criação de eventos na agenda
- Configurações do ministério

## 🚀 Tecnologias Utilizadas

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Lucide React** para ícones
- **Firebase** (configuração preparada)

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd qg-worship
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o Firebase (opcional):
   - Edite `src/firebase/config.ts`
   - Adicione suas credenciais do Firebase

4. Execute o projeto:
```bash
npm run dev
```

## 🔐 Acesso Administrativo

**Credenciais de Demo:**
- Email: `admin@qgworship.com`
- Senha: `admin123`

## 📱 Responsividade

O site é totalmente responsivo e funciona perfeitamente em:
- Desktop
- Tablet
- Mobile

## 🎨 Design

- Interface moderna com efeitos glassmorphism
- Gradientes e animações suaves
- Tema escuro/claro adaptável
- Ícones intuitivos

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção

## 📂 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── types/         # Definições TypeScript
├── utils/         # Funções utilitárias
├── firebase/      # Configuração Firebase
└── App.tsx        # Componente principal
```

## 🚀 Deploy no Netlify

### Configuração Rápida:

1. **Conecte seu repositório no Netlify**
   - Faça login em [netlify.com](https://netlify.com)
   - Clique em "Add new site" → "Import an existing project"
   - Conecte seu repositório Git

2. **Configurações de Build** (já estão no `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `20`

3. **Variáveis de Ambiente** (Opcional - apenas se quiser separar prod/dev):
   - Vá em Site settings → Environment variables
   - Adicione (opcional, pois já tem valores hardcoded como fallback):
     ```
     VITE_FIREBASE_API_KEY = sua_api_key
     VITE_FIREBASE_AUTH_DOMAIN = seu_auth_domain
     VITE_FIREBASE_PROJECT_ID = seu_project_id
     VITE_FIREBASE_STORAGE_BUCKET = seu_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID = seu_messaging_sender_id
     VITE_FIREBASE_APP_ID = seu_app_id
     ```

4. **Deploy**
   - Clique em "Deploy site"
   - Aguarde o build completar
   - Seu site estará no ar! 🎉

### Deploy Manual (alternativa):

```bash
npm run build
npx netlify-cli deploy --prod
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

---

**Desenvolvido para o Ministério de Louvor QG WORSHIP** 🎵
