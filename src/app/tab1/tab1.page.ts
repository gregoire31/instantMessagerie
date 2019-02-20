import { Component } from '@angular/core';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  users : any[]
  userName : String
  userId : string
  entry : any
  userModified : any

  constructor(private userService : UserService) {
    let self = this
      this.userService.getUserList().subscribe( (users) =>{
        self.users = users
        users.map(user => {
          console.log(user)
        })
        //this.userModified = users
        //let longeurUsers = users.length
        //for(let i = 0 ; i < longeurUsers ; i++){
        //  this.userModified[i].avatar = users[i].avatar
        //  this.userModified[i].displayName = users[i].displayName
        //  this.userModified[i].id = users[i].id
        //  this.userModified[i].isChecked = false
        //}
        //this.users = users
        //users.map((user) => {
        //  let userBis = user
        //  self.userModified.push({...user})
        //}
        //)
      
    })
   }
  ngOnInit() {
    let self = this
    this.userService.getCurrentUser().then(function(user)  {
      console.log(user)
      self.userId = user.uid
    }).then(()=>{
      console.log(this.userId)
      this.userService.getUserId(this.userId).subscribe(user => {
        console.log(user)
        this.userName = user.displayName
      })
    })
  }

  addUserToChannel(id : string) {
    console.log(id)
  }

  addfriend(){
    this.users.map(user => {
      if(user.isChecked === true){
        this.userService.addFriendsToUsers(this.userId,user.id)
      }
    })
  }

  logout(){
    this.userService.logout()
  }


}
