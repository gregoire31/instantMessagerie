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
  //userName = "toto"


  constructor(private userService : UserService) {
      
   }
  ngOnInit() {
    let self = this
    this.userService.getCurrentUser().then(function(user)  {
      console.log(user)
      self.userName = user.displayName
      self.users = user
    })
  }

  logout(){
    this.userService.logout()
  }


}
