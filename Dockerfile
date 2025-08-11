# Use Node.js 18 as base image
FROM node:18-alpine AS base

# Configure Alpine to use China mirrors
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# Install dependencies needed for the build
RUN apk add --no-cache \
    bash \
    git \
    python3 \
    py3-pip \
    make \
    g++ \
    curl

# Configure npm to use China registry
RUN npm config set registry https://registry.npmmirror.com/

# Configure pip to use Tsinghua mirror
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# Install bun
RUN curl -fsSL https://bun.sh/install | bash

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && \
    pnpm config set registry https://registry.npmmirror.com/ && \
    pnpm install

# Add bun to PATH
ENV PATH=/root/.bun/bin:$PATH

# Copy source code
COPY . .

# install
RUN pnpm i
# Build the application (compile to binary)
RUN pnpm run compile

# Verify files exist after build
RUN ls -la /app/

# Create final runtime image
FROM node:18-alpine AS runtime

# Configure Alpine to use China mirrors
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# Install runtime dependencies
RUN apk add --no-cache \
    bash \
    git \
    python3 \
    py3-pip \
    make \
    g++ \
    curl

# Configure pip to use Tsinghua mirror
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

WORKDIR /workspace

# Create bin directory in the container
RUN mkdir -p /usr/local/bin

# Copy built files from base image to container's bin directory
COPY --from=base /app/dist-bin/kode /usr/local/bin/kode
COPY --from=base /app/yoga.wasm /usr/local/bin/

# Make the CLI executable
RUN chmod +x /usr/local/bin/kode

# Set the entrypoint
ENTRYPOINT ["/usr/local/bin/kode"]