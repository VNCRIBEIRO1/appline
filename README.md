# StockAI Studio 🎨

Gerador de imagens com IA para vender no Adobe Stock.  
Usa a API gratuita do Google Gemini para gerar imagens + metadados completos.

## Funcionalidades

- ✅ Escolha de nichos via checkboxes (12 categorias)
- ✅ Quantidade de imagens (1 a 20)
- ✅ Geração automática de: Título, Descrição, Palavras-chave, Categoria
- ✅ Botão copiar individual por campo
- ✅ "Copiar tudo" por imagem ou todos de uma vez
- ✅ Download de cada imagem gerada
- ✅ Visualizador em tela cheia

---

## Deploy na Vercel (passo a passo)

### 1. Obtenha a chave da API Gemini
Acesse: https://aistudio.google.com/app/apikey  
Crie uma chave gratuita (não precisa de cartão).

### 2. Suba para o GitHub
```bash
git init
git add .
git commit -m "StockAI Studio"
git remote add origin https://github.com/SEU_USUARIO/stock-ai-studio.git
git push -u origin main
```

### 3. Deploy na Vercel
1. Acesse https://vercel.com e faça login
2. Clique em "New Project"
3. Importe o repositório do GitHub
4. Em **Environment Variables**, adicione:
   - `GEMINI_API_KEY` = sua chave do Google AI Studio
5. Clique em **Deploy**

Pronto! O site estará disponível em `https://seu-projeto.vercel.app`

---

## Rodar localmente

```bash
npm install
cp .env.local.example .env.local
# Edite .env.local com sua chave Gemini
npm run dev
```

Acesse: http://localhost:3000

---

## Limites da API gratuita (Gemini)

| Canal          | Limite            |
|----------------|-------------------|
| API (por dia)  | ~500 req/dia      |
| API (por min)  | ~2 imagens/min    |
| AI Studio      | 500–1.000/dia     |

> O site já inclui delay de 4s entre imagens para respeitar o rate limit.

---

## Regras Adobe Stock para imagens IA

- ✅ Marcar "Created with Generative AI" no upload
- ✅ Enviar como "Illustration" (não "Photo")
- ❌ Sem nomes de artistas nos prompts/títulos
- ❌ Sem nomes de pessoas reais
- ❌ Sem marcas ou IPs de terceiros
- ⚠️ Usar upscaler (Topaz Gigapixel, Magnific AI) antes de enviar
