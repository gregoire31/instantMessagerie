import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app'
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userId: any
  user: Observable<any[]>

  constructor(public toastController: ToastController, private _auth: AngularFireAuth, private router:Router) {
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
      message: `Content de vous revoir ${message}`,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Ok',
      color: color
    });
    toast.present();
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
    this._auth
      .auth
      .createUserWithEmailAndPassword(emailRegister, passwordRegister)
      .then(
        (newUser) => {
          this.presentToastWithOptionsWithMessage(nomRegister, "tertiary")
          console.log(newUser)
          newUser.user.updateProfile({
            displayName: nomRegister,
            photoURL: "https://www.gettyimages.ie/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg",
          })
          this.navigateTo('app')
          
          
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
        this.presentToastWithOptionsWithMessage(value.user.displayName, "tertiary")
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
