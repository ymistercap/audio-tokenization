# Audio Tokenization dApp

Cette application décentralisée (dApp) permet de tokeniser des fichiers audio sur la blockchain Ethereum, en utilisant Pinata pour stocker les fichiers sur IPFS et des smart contracts pour gérer la propriété et la vente des tokens.

## Prérequis

- [Node.js](https://nodejs.org/)
- [Foundry](https://book.getfoundry.sh/) pour le développement et le déploiement des contrats Solidity
- Un compte [Pinata](https://pinata.cloud/) pour uploader les fichiers sur IPFS
- Un wallet Ethereum pour interagir avec les contrats (ex: [MetaMask](https://metamask.io/))

## Étapes d'installation

### 1. Cloner le repository

Clonez ce repository en local :

git clone https://github.com/username/audio-tokenization.git
cd audio-tokenization

### 2. Configuration des variables d'environnement

Renommez les fichiers \`.env.example\` en \`.env\` et remplissez-les avec vos informations :

#### À la racine du projet principal (smart contracts) :

.env
SEPOLIA_RPC_URL=
PRIVATE_KEY=

#### À la racine du frontend :

.env
REACT_APP_PINATA_API_KEY=
REACT_APP_PINATA_API_SECRET=

### 3. Déploiement du smart contract

1. Chargez les variables d'environnement :

   source .env

2. Compilez le contrat :

   forge build

3. Déployez le contrat sur le réseau Sepolia :

   forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --legacy --broadcast

   À l'issue de cette commande, une adresse de contrat déployé s'affichera dans le terminal. Copiez cette adresse.

### 4. Mise à jour du frontend

1. Ouvrez le fichier \`App.js\` dans le dossier \`audio-tokenization-frontend\`.
2. Remplacez la valeur de \`contractAddress\` avec l'adresse du contrat déployé :
   \`\`\`javascript
   const contractAddress = "0xVotreAdresseDuContrat";
   \`\`\`

### 5. Installation des dépendances du frontend

1. À la racine du dossier \`audio-tokenization-frontend\`, installez les dépendances :

   npm install

2. Compilez les contrats pour le frontend :

   npm run build-contract

3. Lancez le serveur de développement :

   npm run start

   L'application sera disponible à l'adresse suivante : \`http://localhost:3000\`.

### 6. Utilisation de l'application

1. Connectez votre wallet Ethereum (MetaMask) à l'application.
2. Uploadez un fichier audio sur Pinata via l'interface. Récupérez le hash IPFS généré.
3. Remplissez les informations (nom, hash IPFS, prix) pour créer un token.
4. Le fichier audio est maintenant disponible à la vente sous forme de token ERC-721.

---

Si vous rencontrez des problèmes ou avez des questions, n'hésitez pas à consulter la documentation ou à ouvrir une issue sur le repository GitHub.
