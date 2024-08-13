FROM node:20-slim

RUN apt-get update && apt-get install -y \
    git

# playwright
RUN apt-get update && npx playwright install-deps

USER node
WORKDIR /workspaces
RUN mkdir -p remix-prisma/node_modules
