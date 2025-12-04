# Avant de commencer a travailler

- clonez le repertoire avec `git clone https://github.com/innerviewer/ctrl-alt-win.git`
- dans le repertoire, créez une branche a partir de `dev` (qui est la branche par défaut) avec `git checkout -b contrib/VOTRE_NOM`

# Apres avoir fait des modifications

- faites le commit **EN CHOISISSANT** les fichier qui vous voulez partager
- faites le `git push` (la premiere fois après creation de la branche, utilisez `git push --set-upstream origin contrib/VOTRE_NOM`)
- quand vous aurez finis, faites un PR dev<-contrib/VOTRE_NOM

> [!IMPORTANT]
> Le nom de commit doit correspondre a: `(PARTIE DU PROJET QUE VOUS AVEZ MODIFIE) Ce que vous avez fait.`
> par exemple: `(Footer) Added new CSS styles for the footer.`

# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
