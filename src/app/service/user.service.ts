import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app'
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';


export interface UserList {
  id: string;
  displayName: string;
  avatar: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  userId: any
  user: Observable<any[]>
  private usersCollection: AngularFirestoreCollection<UserList>;
  private users: Observable<UserList[]>;
  uid: string
  displayName : string
  avatar : string

  constructor(public toastController: ToastController, private _auth: AngularFireAuth, private router:Router,db: AngularFirestore) {
    this.usersCollection = db.collection<UserList>('users');
    this.users = this.usersCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );

    firebase.auth().onAuthStateChanged(user => {
      if (user) { this.userId = user.uid}
    });
    
  }
  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      message: 'Email ou Mot de passe incorect',
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Ok',
      color: 'danger'
    });
    toast.present();
  }

  async presentToastWithOptionsWithMessage(message: string, color: string) {
    const toast = await this.toastController.create({
      message: `Bienvenue ${message}`,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Ok',
      color: color
    });
    toast.present();
  }

  getUserList(){
    return this.users
  }

  getUserId(id) {
    return this.usersCollection.doc<UserList>(id).valueChanges();
  }
 
  updateUser(todo: UserList, id: string) {
    return this.usersCollection.doc(id).update(todo);
  }

  updateUserDetail(id: string, displayName:string, avatar:string) {
    console.log("Enregistré")
    this.navigateTo('app')
    return this.usersCollection.doc(id).set({
      id:id,
      displayName: displayName,
      avatar: avatar
    })
    
  }
 
  addUser(todo: UserList) {
    return this.usersCollection.add(todo);
  }
  
  addUserDetails(id:string, displayName: string, avatar : string) {
    return this.usersCollection.doc(id).set({
      id: id,
      displayName: displayName,
      avatar: avatar
    })
  }
 
  removeUser(id) {
    return this.usersCollection.doc(id).delete();
  }

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().onAuthStateChanged(function (user) {
        //if (user) {
        resolve(user);
        //} else {
        //  reject('No user logged inside !!');
        //}
      })
    })
  }
  returnUser(): Observable<any> {
    return this.user
  }

  get currentUser() {
    return (
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          return user
        } else {
          // No user is signed in.
        }
      })
    )
  }


  //get currentUser() {
  //  return this._auth.authState
  //    .pipe(switchMap(auth => auth ? this.getUserById(auth.uid) : of(null)));
  //}
  //
  //getUserById(userId: string) {
  //  return this.doc(`users/${userId}`);
  //}

  returnCurrentUser() {
    this._auth.user.subscribe(user => {        // Permet d'initialiser la variable user pour savoir si qqn est connecté ou pas sur la session
      return user
    })
  }

  signup(emailRegister, passwordRegister, nomRegister) {
    let self = this
    let photoURL =  "https://www.gettyimages.ie/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg"
    this._auth
      .auth
      .createUserWithEmailAndPassword(emailRegister, passwordRegister)
      .then(
        (newUser) => {
          self.addUserDetails(newUser.user.uid,nomRegister,photoURL) 
          this.presentToastWithOptionsWithMessage(nomRegister, "tertiary")
          console.log(newUser)
          newUser.user.updateProfile({
            displayName: nomRegister,
            photoURL: photoURL,
          })
          //console.log(newUser.user.uid)
          //console.log(newUser.user.displayName)
          //console.log(newUser.user.photoURL)
          //self.uid = newUser.user.uid
          //self.displayName = newUser.user.displayName
          //self.avatar = newUser.user.photoURL
        })

        .then(function() {
          self.navigateTo('app')
        })
      .catch(err => {
        this.presentToastWithOptionsWithMessage(err.message, "warning")
      });
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }


  login(email, password) {
    return this._auth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log(value);
        console.log(value.user.displayName)
        this.navigateTo('app')
      })
      .catch(err => {
        this.presentToastWithOptions()
      });
  }

  logout() {
    return this._auth.auth.signOut();
  }

}
