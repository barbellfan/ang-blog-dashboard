import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { FsCategory } from 'src/app/models/fs-category';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';

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

  formStatus: string = 'Add New';

  docId: string = '';

  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute) {
      this.route.queryParams.subscribe(val => {

        this.docId = val['id'];

        if (this.docId) {
          this.postService.loadOneData(val['id']).subscribe(post => {

            this.postForm = this.fb.group({
              title: [post.title, [Validators.required, Validators.minLength(10)]],
              permalink: [{value: post.permalink, disabled: true}, Validators.required],
              excerpt: [post.excerpt, [Validators.required, Validators.minLength(50)]],
              category: [`${post.category.categoryId}-${post.category.category}`, Validators.required],
              postImg: ['', Validators.required],
              content: [post.content, Validators.required]
            });

            this.imgSrc = post.postImgPath;
            this.formStatus = 'Edit';

          });
        } else {
          this.postForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(10)]],
            permalink: [{value: '', disabled: true}, Validators.required],
            excerpt: ['', [Validators.required, Validators.minLength(50)]],
            category: ['', Validators.required],
            postImg: ['', Validators.required],
            content: ['', Validators.required]
          });
        }
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

  get fc(): any {
    return this.postForm.controls;
  }

  onTitleChanged($event: any) {
    const title: string = $event.target.value;
    this.postForm.controls['permalink'].setValue(title.replace(/\s/g, '-'));
  }

  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    }

    reader.readAsDataURL($event.target.files[0]);
    this.selectedImage = $event.target.files[0];
  }

  onSubmit() {
    let splitted = this.postForm.value.category.split('-');

    const postData: Post = {
      firebaseID: '',
      title: this.postForm.value.title,
      permalink: this.postForm.controls['permalink'].getRawValue(),
      category: {
        categoryId: splitted[0],
        category: splitted[1]
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date()
    };

    this.postService.uploadImage(this.selectedImage, postData, this.formStatus, this.docId);
    this.postForm.reset();
    this.imgSrc = './assets/placeholder-image.jpg';
  }

}
