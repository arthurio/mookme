# CLI & references

## `mookme init`

The main initialization command. It :

- prompts for one or multiple packages folder path
- asks you to select one or multiple package at each path
- creates the `.hooks` folder in each package where you can write **dedicated hooks !** that will be triggered only when changes in this package occur
- creates a `.hooks` folder at the root of your project where you can write **project-wide hooks** that will be triggered on every commit
- writes `.git/hooks` files

### Options

- `--only-hook` (optional)

Skip prompters and only write `.git/hooks` files. This is for installation in an already-configured project.

## `mookme run`

Mainly used for debugging and dry run :

`mookme run --type pre-commit -a "test arguments"`

### Options

- `-t --type` (required)

The type of hook to run, has to be one of `pre-commit`, `prepare-commit-msg`, `commit-msg`, `post-commit`.

- `-a --args` (optional)

The arguments that would be normally passed by git to the hook

- `-r --run-all` (optional)

Skip the selection of hooks to run based on git-staged files, and run hooks of every package for this type

## Hook files

With `mookme`, your hooks are stored in JSON files called `{hook-type}.json` where the hook type is one of the available git hooks, eg :

- `pre-commit`
- `prepare-commit-msg`
- `commit-msg`
- `post-commit`

### Available options

- `steps`

The list of steps being executed by this hook

- `type`

A flag used mainly to tell `mookme` this is a python hook, and might need a virtual environment to be activated.

- `venvActivate`

A path to a `<venv>/bin/activate` script to execute before the command if the hook type is `python`