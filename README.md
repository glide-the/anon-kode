# ANON KODE

DESC: https://www.reddit.com/r/LocalLLaMA/comments/1kbamoh/dnakovanonkode_github_repo_taken_down_by_anthropic/

modify model proiv：[ZAI_MODEL_SUPPORT](./ZAI_MODEL_SUPPORT.md)

Terminal-based AI coding tool that can use any model that supports the OpenAI-style API.

- Fixes your spaghetti code
- Explains wtf that function does
- Runs tests, shell commands and stuff
- Whatever else claude-code can do, depending on the model you use

## HOW TO USE

### Local Installation

```
npm install -g anon-kode
cd your-project
kode
```

### Docker Usage


#### Alternative: Build from local source

```bash
# Clone the repository
git clone https://github.com/dnakov/anon-kode.git
cd anon-kode

# Build the image locally
docker build -t anon-kode .

# Run in your project directory
cd your-project
docker run -it --rm \
  -v $(pwd):/workspace \
  -v ~/.koding:/root/.koding \
  -v ~/.koding.json:/root/.koding.json \
  -w /workspace \
  anon-kode
```

#### Docker Configuration Details

The Docker setup includes:

- **Volume Mounts**:
  - `$(pwd):/workspace` - Mounts your current project directory
  - `~/.koding:/root/.koding` - Preserves your anon-kode configuration directory between runs
  - `~/.koding.json:/root/.koding.json` - Preserves your anon-kode global configuration file between runs

- **Working Directory**: Set to `/workspace` inside the container

- **Interactive Mode**: Uses `-it` flags for interactive terminal access

- **Cleanup**: `--rm` flag removes the container after exit

**Note**: Anon Kode uses both `~/.koding` directory for additional data (like memory files) and `~/.koding.json` file for global configuration.

The first time you run the Docker command, it will build the image. Subsequent runs will use the cached image for faster startup.

You can use the onboarding to set up the model, or `/model`.
If you don't see the models you want on the list, you can manually set them in `/config`
As long as you have an openai-like endpoint, it should work.

## USE AS MCP SERVER

Find the full path to `kode` with `which kode` then add the config to Claude Desktop:
```
{
  "mcpServers": {
    "claude-code": {
      "command": "/path/to/kode",
      "args": ["mcp", "serve"]
    }
  }
}
```

## HOW TO DEV

```
pnpm i
pnpm run dev
pnpm run build
```

Get some more logs while debugging:
```
NODE_ENV=development pnpm run dev --verbose --debug
```

## BUGS

You can submit a bug from within the app with `/bug`, it will open a browser to github issue create with stuff filed out.

## Warning

Use at own risk.


## YOUR DATA

- There's no telemetry or backend servers other than the AI providers you choose
- Global configuration is stored in `~/.koding.json` file
- Additional data (like memory files) is stored in `~/.koding` directory
- Project-specific settings are stored within the global config file, indexed by project path
