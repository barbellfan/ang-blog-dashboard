import { Component, OnInit } from '@angular/core';
import { FsCategory } from 'src/app/models/fs-category';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css']
})
export class AllPostsComponent implements OnInit {

  constructor(private postService: PostsService) { }

  ngOnInit(): void {
    this.postService.loadData().then(
      function(val: FsCategory[]) {
        console.log(val);
      }
    );
  }

}
