import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  permalink: string = '';

  ngOnInit(): void {
  }

  onTitleChanged($event: any) {
    const title: string = $event.target.value;
    this.permalink = title.replace(/\s/g, '-');

  }

}
