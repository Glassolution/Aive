# Agendamento de calls

O fluxo de agendamento usa slots de 45 minutos em `America/Sao_Paulo`, de segunda a sexta, das 9h às 18h, com antecedência mínima de 2 horas.

Para e-mails funcionarem, crie uma conta no Resend, verifique um domínio e configure:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`, por exemplo `Aive <agenda@seudominio.com>`. O endereço precisa pertencer ao domínio verificado no Resend.
- `SCHEDULING_OWNER_EMAIL`, com um ou mais e-mails separados por vírgula para receber alertas internos.

Como o projeto indica deploy atual na Vercel (`vercel.json`), a persistência foi preparada para Vercel Postgres/Postgres compatível. Configure uma integração Postgres/Neon na Vercel e exponha:

- `POSTGRES_URL`

Em desenvolvimento local, se `POSTGRES_URL` não existir, os agendamentos são salvos em `.data/bookings.local.json`. Esse fallback é apenas para teste local.
