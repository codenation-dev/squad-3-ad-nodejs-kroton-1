# Passos para o GitFlow

## Primeiro passo

Caso você não tenha o repositório local (no seu computador):

```
git clone https://github.com/codenation-dev/squad-3-ad-nodejs-kroton-1.git
```

Caso você já possua o repositório clonado, primeiro verifique se o remote é o mesmo:

```
git remote -v
```

Você também pode verificar todas as branchs existentes:

```
git branch -a
```
## Atualizar com o repositório remoto

Tendo em mente que você já tem o repositório clonado, agora você precisa verificar se o seu repositório local está up-to-date com o repositório remoto.
Tenha em mente que você deve estar na branch develop para poder dar o "git pull" (que ira atualizar o seu repositorio local).
Use "git branch" para verificar qual branch você se encontra atualmente. Caso não esteja na branch develop, use o comando:

```
git checkout develop
```
Após entrar na branch develop, você deve atualizar o seu repositório local com o remoto com o seguinte comando:

```
git pull
```
## Trabalhando em uma feature

Tendo em vista que seu repositório local está atualizado com o repositório remoto, agora você poderá criar uma branch separada a **partir da branch develop** com o nome feature. Essa branch você irá trabalhar em uma feature em específico para depois dar pull request na branch develop. Assim, crie a branch da feature com o seguinte comando:

```
git branch -b feature/nome-da-feature
```

Agora, você deve trabalhar na feature fazendo os commits normalmente. **(nao esqueça dos commits!)**
Para lembrar:

Adicionar o arquivo ao "staged" (estágio do arquivo pronto para commitar):

```
git add nomedoarquivo
```

Você pode adicionar todos os arquivos de uma vez:

```
git add .
```

E agora é só commitar:

```
git commit -m "mensagem do commit"
```

### Subir as modificações da branch de feature para o repositório remoto

Agora que você já commitou todas as suas modificações na branch da feature, é preciso subir essas modificações para o repositório remoto e a partir disso vocÊ estará apto a fazer o Pull Request. Você irá usar o nome da branch da feature.

```
git push origin feature/nome-da-feature
```

Após ter feito isso, os arquivos serão enviados ao repositório remoto dentro da branch da feature, ou seja, as modificações não irão aparecer em outras branches (como a master ou develop).

## Fazendo o Pull Request

Você deverá acessar o repositório remoto no github:

[Repositorio](https://github.com/codenation-dev/squad-3-ad-nodejs-kroton-1)

Acesse a branch da feature na interface do GitHub (pode ser no botão das branchs ou na aba das branche, se vira).

Ao acessar a branch da feature que você criou, ira aparecer no canto direito um botão verde escrito **Compare & pull request**.
Clique nesse botão para iniciar o pull request.

**Fique atento!**
Você deverá selecionar a branch develop no botão "base" logo abaixo do escrito "Open Pull Request".
Caso o botão base esteja na branch master, a seguinte mensagem deve aparecer:
**Can’t automatically merge. Don’t worry, you can still create the pull request.**
Portanto, fique atento e altere o botão base para a branch develop.

Feito isso, escreva uma mensagem na caixa de texto destinada para tal, descrevendo brevemente o que foi feito nesta feature.

Após fazer isso, basta apenas você clinar no botão "Create pull request".

Após ter feito o pull request, você deve enviar uma mensagem no grupo do whatsapp para que todos possam fazer o code review e, após, ser feito o merge.

## Fazendo o Merge

Entrar no pull request e clicar no botão "Merge pull request" e depois "Confirm merge"