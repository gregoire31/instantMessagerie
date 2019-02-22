import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../service/user.service';


@Component({
  selector: 'app-text-message',
  templateUrl: './text-message.page.html',
  styleUrls: ['./text-message.page.scss'],
})
export class TextMessagePage implements OnInit {
  channelId: string
  channelName : string
  channel : any
  textMsg : string
  userId : string
  messages : any
  constructor(public activatedRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    let self = this
    this.channelId = this.activatedRoute.snapshot.paramMap.get('channelId');
    this.userService.returnDetailsChannel(this.channelId).subscribe((channel)=> {
      //self.channelName = channel.name
      self.channel = channel
    })
    this.userService.getCurrentUser().then(function (user) {
      console.log(user)
      self.userId = user.uid
    })

    this.userService.listeAllMessageOfAChannel(this.channelId).subscribe((data)=>{
      console.log(data)
    })
  }


  TextSubmit(){
    console.log(this.channelId)
    let date = new Date();
    this.userService.addMessageToChannel(this.channelId,this.userId,this.textMsg,date)
  }

}
