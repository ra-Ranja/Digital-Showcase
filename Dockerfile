FROM node:18-alpine
WORKDIR /app

# Installer pnpm
RUN npm install -g pnpm

# Copier les fichiers workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json tsconfig.json ./

# Copier les packages workspace dont dépend api-server
COPY lib/ ./lib/
COPY artifacts/api-server/ ./artifacts/api-server/

# Installer toutes les dépendances
RUN pnpm install --frozen-lockfile

# Builder le serveur
WORKDIR /app/artifacts/api-server
RUN pnpm build

# Exposer le port Cloud Run
EXPOSE 8080

ENV PORT=8080

CMD ["node", "dist/index.cjs"]