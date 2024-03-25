## Contributing
If you want to contribute, please open an issue or a pull request. I'm open to suggestions and improvements.

First of all, clone the repository and install the dependencies. The `.nvmrc` file points to the latest `lts-iron`:

```bash
nvm use # or fnm use
corepack install
pnpm install
```

Then, you can run the app in `watch` mode:
```bash
pnpm build:watch
```

You can use biome to lint/check/format the code:
```bash
pnpm biome:check
pnpm biome:format
pnpm biome:lint
```
