# Guia de publicação — convite.heringfotografia.com.br

Este guia assume que você **não** tem experiência técnica. Siga na ordem. Cada
etapa é gratuita (planos free da Vercel e do banco de dados são mais do que
suficientes para um convite de aniversário).

No fim você vai ter o site publicado em `https://convite.heringfotografia.com.br`.

---

## 1. Colocar o código no GitHub

1. Crie uma conta em [github.com](https://github.com) (se ainda não tiver).
2. Crie um repositório novo (botão verde **New**), pode ser **privado**.
   Não marque nenhuma opção de "adicionar README" — o projeto já tem os arquivos.
3. No computador onde está esta pasta do projeto, rode no terminal (dentro da pasta `app`):

   ```bash
   git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
   git branch -M main
   git add -A
   git commit -m "Site do convite"
   git push -u origin main
   ```

   (Se pedir login, use suas credenciais do GitHub. Ele já tem um commit inicial pronto.)

## 2. Criar o banco de dados (Postgres gratuito)

1. Entre em [vercel.com](https://vercel.com) e crie uma conta (dá para entrar direto com o GitHub).
2. Dentro da Vercel, vá em **Storage** → **Create Database** → escolha **Postgres** (Neon).
3. Dê um nome (ex: `convite-db`) e crie. Não precisa mexer em mais nada.
4. Guarde essa aba aberta — vamos conectar ao projeto no próximo passo.

## 3. Importar o projeto na Vercel

1. Na Vercel, clique em **Add New** → **Project**.
2. Selecione o repositório que você criou no passo 1 e clique em **Import**.
3. Antes de clicar em **Deploy**, abra **Environment Variables** e adicione:

   | Nome | Valor |
   |---|---|
   | `ADMIN_PASSWORD` | a senha que você quer usar para entrar como administrador |
   | `DATABASE_URL` | a connection string do banco criado no passo 2 |

   Para pegar o `DATABASE_URL`: volte na aba do banco (Storage → seu banco →
   aba **.env.local** ou **Quickstart**) e copie o valor que começa com
   `postgres://...`. Se a Vercel já tiver conectado o banco automaticamente ao
   projeto, ela mesma preenche variáveis como `POSTGRES_URL` — nesse caso, só
   copie o valor dela e cole numa variável **nova** chamada exatamente
   `DATABASE_URL` (maiúsculo, sem espaços).

4. Clique em **Deploy** e aguarde ~1 minuto.

Ao terminar, a Vercel te dá um link tipo `convite-xxxx.vercel.app` — teste ele
antes de seguir para o próximo passo. Entre em `/admin` e confirme que a senha
funciona.

## 4. Conectar o subdomínio convite.heringfotografia.com.br

1. No projeto, vá em **Settings** → **Domains**.
2. Digite `convite.heringfotografia.com.br` e clique em **Add**.
3. A Vercel vai mostrar um registro DNS parecido com isto:

   | Tipo | Nome | Valor |
   |---|---|---|
   | CNAME | `convite` | `cname.vercel-dns.com` |

4. Entre no painel onde o domínio **heringfotografia.com.br** está registrado
   (Registro.br, Hostgator, GoDaddy, etc. — o mesmo lugar onde o site
   principal da Hering Fotografia é gerenciado) e adicione esse registro CNAME
   exatamente como a Vercel mostrou.
5. Volte na Vercel — em alguns minutos (às vezes até 1h) o domínio aparece
   como **Válido** com um cadeado, e o site já responde em
   `https://convite.heringfotografia.com.br` com HTTPS automático.

> Se você não tiver acesso ao painel de DNS, quem administra o domínio
> `heringfotografia.com.br` precisa adicionar esse único registro CNAME —
> é a única etapa que exige acesso a esse painel.

## 5. Testar tudo no ar

1. Acesse `https://convite.heringfotografia.com.br` pelo celular.
2. Vá até o fim da página, toque em **"Área administrativa"** e entre com a
   `ADMIN_PASSWORD` que você definiu.
3. Gere um link de teste, confirme presença nele (num outro navegador/aba
   anônima, simulando o convidado) e veja se ele aparece como **Confirmado**
   na lista do admin.
4. Pode revogar/ignorar esse link de teste depois — ele não aparece pro
   convidado real, é só uma entrada a mais na sua lista.

## Depois de publicado

- **Trocar textos** (data, endereço, mensagem): edite `src/lib/content.ts`,
  faça `git commit` + `git push` — a Vercel republica sozinha em ~1 minuto.
- **Trocar a senha do admin**: mude o valor de `ADMIN_PASSWORD` em Vercel →
  Settings → Environment Variables, e clique em **Redeploy**.
- **Ver a lista de confirmados a qualquer momento**: `/admin` no site, com a senha.
