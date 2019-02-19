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



  constructor(private userService : UserService) {
      this.userService.getUserList().subscribe( (users) =>{
        console.log(users)
        this.users = users
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

  logout(){
    this.userService.logout()
  }


}
