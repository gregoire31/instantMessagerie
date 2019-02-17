import { Component } from '@angular/core';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  users : any
  userName : string
  avatar : string
  userId : string
  //userName = "toto"
  channelName: string
  displayName : string
  userList : any

  constructor(private userService : UserService) {
    this.userService.getUserList().subscribe( (users) =>{
      console.log(users)
      this.userList = users
    })

   }

   ngOnInit() {
    let self = this
    
    this.userService.getCurrentUser().then(function (user) {
      console.log(user)
      self.userId = user.uid
    }).then(() => {
      this.userService.getUserId(this.userId).subscribe(user => {
        console.log(user.displayName)
        this.avatar = user.avatar
        this.displayName = user.displayName
        self.users = user
      })
    }
    )
  }

  createChannel() {
    this.userService.createChannel(this.userId, this.channelName)
  }


}
