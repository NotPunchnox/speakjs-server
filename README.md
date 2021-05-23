# speak.js server

## local:

créez un fichier .env ou completez la config dans le programme:

![ScreenShot](https://cdn.discordapp.com/attachments/835290042401423380/846000698977812531/Capture5.PNG)

>pour installer les modules:
```
npm install -g
```
> pour le lancer
```
npm run start
```
ou 
```
node .
```

le serveur sera sur l'url: http://localhost:3000

### Comment créer son propre serveur speak.js ?

> tout d'abord vous devez vous rendre sur le https://mongodb.com, ouvrez un compte.

__Faites un projet:__ ![ScreenShot](https://cdn.discordapp.com/attachments/835290042401423380/845997844807680040/capture.PNG)

Cliquez sur `'build cluster'`, pour créer votre db ( prenez l'abonnement gratuit vous n'aurez pas besoin de beaucoup de place ).

par défaut l'emplacement de votre db sera sur `"N. Virginia (us-east-1)"` vous pouvez laisser ou le changer, pour ma part je suis sur `"Frankfurt (eut-central-1)"`.
Recliquez sur `"create cluster"`, puis patientez pendant 5 minutes....

> pour le moment vous allez whiltelist les adresses Ip ( je vais autoriser toutes les adresses Ip à se connecter pour ma part).

![ScreenShot](https://cdn.discordapp.com/attachments/835290042401423380/845997846289317908/Capture2.PNG)

Ensuite rendez-vous sur 'Database Access' puis créez un utilisateur: ![ScreenShot](https://cdn.discordapp.com/attachments/835290042401423380/845997851296661515/Capture3.PNG)

Maintenant nous retournons sur notre `cluster`, cliquez sur `'connect'` et `'connect your application'`. Vous deverez avoir cela:
> 'mongodb+srv://admin:<password>@cluster0.hbdch.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
  
_il vous reste juste à le compléter avec les informations que nous avons créées tout à l'heure_
  
Maintenant vous allez faire un repo github ( privé de préference )
  
Ouvrez un compte heroku, créez une application ( application qui aura le nom de votre serveur ),

> rendez-vous sur `'Deploy'`: 
![ScreenShot](https://cdn.discordapp.com/attachments/835290042401423380/845997844635844628/Capture4.PNG)
connectez votre github et votre repo que vous aurez Fork de celui-ci
  
# Et voilà vous avez créé votre serveur speak
## son url sera: yourapp.herokuapp.com
  
  pour vous connecter à votre serveur ( local ou web ) vous aurez juste à le rentrer sur:
  https://github.com/NotPunchnox/speakjs
  `server custom`, `gateway url`
