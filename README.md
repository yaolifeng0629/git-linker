# git-linker
git-linker — Tools to simplify Git repository multiplatform commit configuration

# How to use?
1. Install package
```bash
pnpm install git-linker -g

npm install -g git-linker
```
2. Terminal input git-linker：

```bash

MZG@DESKTOP-KKAB511 MINGW64 /d/Projects/git-linker (master)
$ git-linker
Please enter the local project path:
> D:\Projects\PersonalProjects\xxxx
Please enter the new URL:
> https or ssh url

# The result as follows:
  # succcess: Successfully configured.
  # fail: To see error message
  # already exists: The new URL already exists in the config file.
```
