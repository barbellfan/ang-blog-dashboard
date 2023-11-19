import { Component, OnInit } from '@angular/core';
import { FsCategory } from 'src/app/models/fs-category';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css']
})
export class AllPostsComponent implements OnInit {

  postArray: Post[] = [];

  constructor(private postService: PostsService) { }

  ngOnInit(): void {
    this.loadPostArray();
  }

  loadPostArray(): void {
    let thisthis = this;
    this.postService.loadData().then(
      function(val: Post[]) {
        //console.log(val);
        thisthis.postArray = val;
      }
    );
  }

  onDelete(postImgPath: string, id: string) {
    this.postService.deleteImage(postImgPath, id);
  }
}
