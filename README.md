# Mente Viva - Guia de Deploy na VPS (Debian 12 com Docker)

Este guia contém todas as instruções para colocar sua aplicação Mente Viva no ar em seu servidor de produção. Usaremos Docker para criar um ambiente isolado e consistente, facilitando o processo.

## Pré-requisitos

Você precisa ter acesso à sua VPS Debian 12 com um usuário que tenha permissões `sudo`.

## Passo 1: Instalar o Docker na sua VPS

Conecte-se à sua VPS via SSH e execute os seguintes comandos para instalar o Docker:

```bash
# Atualizar a lista de pacotes
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl gnupg

# Adicionar a chave GPG oficial do Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Adicionar o repositório do Docker
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar o Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## Passo 2: Copiar os Arquivos da Aplicação

Copie todos os arquivos gerados (incluindo este `README.md`, `Dockerfile`, `package.json`, etc.) para um diretório na sua VPS. Você pode fazer isso usando `scp` ou `rsync`.

Exemplo com `scp`:
```bash
# No seu computador local, navegue até a pasta do projeto e execute:
scp -r . seu_usuario@ip_da_vps:~/mente-viva-app
```

## Passo 3: Configurar as Variáveis de Ambiente

Na sua VPS, dentro do diretório `~/mente-viva-app`, crie o arquivo de variáveis de ambiente.

1.  Copie o arquivo de exemplo:
    ```bash
    cd ~/mente-viva-app
    cp .env.example .env
    ```

2.  Abra o arquivo `.env` para editá-lo. Use um editor como `nano`:
    ```bash
    nano .env
    ```

3.  Preencha com suas chaves secretas. O arquivo deve ficar assim:

    ```env
    # Chave da API do Google Gemini (obrigatória para os insights da IA)
    VITE_GEMINI_API_KEY=SUA_CHAVE_GEMINI_AQUI

    # Credenciais do seu projeto Supabase (obrigatórias)
    VITE_SUPABASE_URL=https://jzebhmrcsltzjqebxczx.supabase.co
    VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    ```
    **Salve e feche o arquivo** (em `nano`, use `Ctrl+X`, depois `Y`, e `Enter`).


## Passo 4: Construir (Build) e Rodar a Aplicação com Docker

Agora que tudo está configurado, vamos construir a imagem Docker e iniciar o container.

1.  **Construa a imagem Docker:**
    Este comando lê o `Dockerfile`, instala as dependências, compila sua aplicação e a empacota com o servidor Nginx. O processo pode levar alguns minutos.
    ```bash
    docker build -t mente-viva .
    ```

2.  **Rode o container:**
    Este comando inicia sua aplicação. Ela ficará acessível na porta 80.
    ```bash
    # O -d roda o container em background
    # O -p 80:80 mapeia a porta 80 da sua VPS para a porta 80 do container
    # O --restart always garante que a aplicação reinicie automaticamente se o servidor for reiniciado
    docker run -d -p 80:80 --restart always --name mente-viva-container mente-viva
    ```

## Pronto!

Sua aplicação Mente Viva está agora no ar! Você pode acessá-la visitando o endereço de IP da sua VPS em um navegador (`http://ip_da_sua_vps`).

### Comandos Úteis do Docker

-   **Ver os logs da aplicação:**
    ```bash
    docker logs -f mente-viva-container
    ```

-   **Parar a aplicação:**
    ```bash
    docker stop mente-viva-container
    ```

-   **Reiniciar a aplicação:**
    ```bash
    docker start mente-viva-container
    ```

-   **Remover o container (para reconstruir):**
    ```bash
    docker stop mente-viva-container
    docker rm mente-viva-container
    ```
