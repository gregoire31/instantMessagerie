import { Component } from '@angular/core';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  users : any[]
  userName : string
  avatar : string
  userId : string
  //userName = "toto"
  users2 : any[]

  constructor(private userService : UserService) {
    let self = this
    this.userService.getUserList().subscribe( (users) =>{
      console.log(users)
      self.users2 = users
    })
   }

  ngOnInit() {
    let self = this
    this.userService.getCurrentUser().then(function(user)  {
      self.users = user
      self.userId = user.uid
      self.userName = user.displayName
      self.avatar = user.photoURL
    })
  }

  save() {
    //this.userService.listAllUsers()
    let idAExtraire : string
    console.log(this.users)
    this.users2.map( user => {
      if (user.uid === this.userId){
        idAExtraire = user.id
      }
    })
    this.userService.updateUserDetails(idAExtraire,this.userName,this.avatar)
  }

  logout(){
    this.userService.logout()
  }


}
