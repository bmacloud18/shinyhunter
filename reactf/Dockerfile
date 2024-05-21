FROM node:20 AS base
SHELL ["/bin/bash", "-c"]
WORKDIR /reactf
ENV NEXT_TELEMETRY_DISABLED 1

# Install dependencies, run dev server. 
FROM base AS dev-runner
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 80

ENV PORT 80
CMD ["npm", "run", "dev"]
