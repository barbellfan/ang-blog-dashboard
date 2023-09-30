import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FsCategory } from 'src/app/models/fs-category';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  permalink: string = '';
  imgSrc: any = './assets/placeholder-image.jpg';
  selectedImage: any;
  categories: Array<FsCategory> = [];
  postForm!: FormGroup;

  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder) {
      this.postForm = this.fb.group({
        title: [''],
        permalink: {value: '', disabled: true},
        excerpt: [''],
        category: [''],
        postImg: [''],
        content: ['']
      });
    }

  ngOnInit(): void {
    let thisthis = this;
    this.categoryService.loadData().then(
      function(val: FsCategory[]) {
        thisthis.categories = val;
      },
      function(error) {
        console.log("data not loaded: " + error);

      }
    );
  }

  onTitleChanged($event: any) {
    const title: string = $event.target.value;
    this.permalink = title.replace(/\s/g, '-');

  }

  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    }

    reader.readAsDataURL($event.target.files[0]);
    this.selectedImage = $event.target.files[0];
  }

}
