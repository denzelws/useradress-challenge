## Tecnologias Utilizadas

* **Backend:** Java, Spring Boot, Spring Data JPA, PostgreSQL.
* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Shadcn UI.
* **Infraestrutura:** Docker & Docker Compose.

## Acesso de Administrador

Para testar as funcionalidades exclusivas de gestão (listar todos os usuários, visão global de endereços, exclusão em cascata), utilize as seguintes credenciais na tela de login:

* **CPF:** `000.000.000-00` (ou apenas os números `00000000000`)
* **Senha:** `admin123`

---

## 🐳 Como Executar o Projeto

A infraestrutura foi desenhada de forma híbrida: o **Backend e o Banco de Dados** rodam isolados via Docker, enquanto o **Frontend** é executado localmente.

### Passo 1: Iniciar o Backend e o Banco de Dados (Docker)
Certifique-se de ter o [Docker](https://www.docker.com/) instalado e rodando. No terminal, navegue até a pasta raiz do projeto (onde está o arquivo `docker-compose.yml`) e execute:

```bash
docker-compose up --build
