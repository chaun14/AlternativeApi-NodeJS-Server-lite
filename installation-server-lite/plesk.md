---
description: >-
  Découvrez comment installer le NodeJs download server lite sur le panel
  d'hébergement web plesk
---

# Plesk

## Préparation

Connectez vous sur votre panel plesk et allez sur la page principale

![](../.gitbook/assets/1.png)

{% hint style="info" %}
Si vous n'avez pas la même vue que moi, sélectionnez la vue dynamique en haut à droite \(bouton changer de vue\) 
{% endhint %}

Nous allons maintenant créer un sous domaine pour le launcheur

![](../.gitbook/assets/2.png)

![](../.gitbook/assets/3.png)

entrez le nom que vous souhaitez et appuyez sur "OK"

#### Cliquez sur le sous domaine pour le faire défiler

![](../.gitbook/assets/5.png)

#### Allez dans le gestionnaire de fichiers

![](../.gitbook/assets/6.png)

#### Cliquez sur la case à cocher pour tout sélectionner puis sur le bouton supprimer

![](../.gitbook/assets/7.png)

#### Téléchargeons le serveur à partir de Github

![](../.gitbook/assets/10.png)

#### Extraire l'archive sur votre ordinateur

![](../.gitbook/assets/11.png)

Une fois le contenu extrait, envoyez le sur le serveur via FTP \(avec Winscp par exemple\) ou via le gestionnaire de fichiers de plesk

![Vous vous retrouvez donc avec &#xE7;a](../.gitbook/assets/14.png)

{% hint style="info" %}
Vous aurez sans doute plus de fichier que moi \(qui finissent en .md\). Ils sont inutiles, pas besoin de les envoyer sur le serveur
{% endhint %}

## Installation

Retournez sur la page principale de plesk. Et cherchez le bouton NodeJS \(si vous ne le trouvez pas, il est possible que cette fonctionnalité ne sois pas installé, contactez votre hébergeur\)

![ce bouton peut avoir plusieurs formes ](../.gitbook/assets/15.png)

Vous arriverez sur une page comme celle là:

![](../.gitbook/assets/16.png)

cliquez sur le `/` dans la rubrique "Root d'application" et sélectionnez votre sous domaine pour le launcheur.

![](../.gitbook/assets/17.png)

Cliquez sur `activer Node.js`

cliquez sur  `installer NPM`

Puis cliquez sur redémarrer l'app.

Une fois que tout est fait, il ne vous reste plus qu'à aller à l'adresse de votre sous domaine 

![](../.gitbook/assets/image.png)

{% hint style="success" %}
Si vous voyez ceci c'est que votre serveur de téléchargement est en place 
{% endhint %}

