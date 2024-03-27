# @razorsim/commit-companion

## 0.6.0

### Minor Changes

- 4312c2e: support streams for reading api response

## 0.5.2

### Patch Changes

- 5c23009: if the consola box title is larger than the width of the box, a fatal error occurs. As a fix, padding has been added and the titles have been shortened

## 0.5.1

### Patch Changes

- 209be60: fix a bug affecting the print of the files ready to be staged

## 0.5.0

### Minor Changes

- fba5c6c: Refactor code structure and improve UX with user prompts

  This change refactors the code structure, improves the user experience by adding user prompts, and enhances error handling. The main changes include:

  - Refactoring the `consola` instance to a centralized location for better reusability.
  - Adding several user prompts for setting up the API key, choosing a model, and managing other configurations.
  - Improving error handling by providing more informative error messages.
  - Updating dependencies and making minor improvements to overall code quality.

## 0.4.3

### Patch Changes

- 7a32484: remove postinstall script

## 0.4.2

### Patch Changes

- cb224f3: update readme

## 0.4.1

### Patch Changes

- 98c5f66: fix changelog, it was preventing the ci to run smoothly

## 0.4.0

### Minor Changes

- 33cffff: add the `--semantic` flag to the generate command, enabling the semantic commit prompt generation

## 0.3.0

### Minor Changes

- 815c475: updated the models for the Perplexity API

### Patch Changes

- d4477c4: update dependencies

## 0.2.6

### Patch Changes

- 15eaa36: fix a bug preventing the ci to get the correct release message

## 0.2.5

### Patch Changes

- ad1142f: fix ci workflow by issuing the GH_TOKEN

## 0.2.4

### Patch Changes

- 970b900: automate the release creation through github workflows

## 0.2.3

### Patch Changes

- c81da60: trigger ci

## 0.2.2

### Patch Changes

- fd00e0a: trigger pipeline to test publish and tags

## 0.2.1

### Patch Changes

- ba0d306: trigger ci to test release process

## 0.2.0

### Minor Changes

- 8a6c7b1: Add codellama-70b-instruct to the supported models array

## 0.1.4

### Patch Changes

- 286bffe: Push tags when releasing

## 0.1.3

### Patch Changes

- ce832d6: fix: update shebang to be more portable

## 0.1.2

### Patch Changes

- 46780fb: fix: wrong import in sdk

## 0.1.1

### Patch Changes

- 7835fe7: trigger the ci

## 0.1.0

### Minor Changes

- 9512c71: First minor release, cli works, prompt needs to be improved
