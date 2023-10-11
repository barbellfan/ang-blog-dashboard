import { Injectable, inject } from '@angular/core';
import { Storage,ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private storage: Storage = inject(Storage);

  constructor() { }

  uploadImage(selectedImage: any, postData: Post) {
    const filePath = `postIMG/${Date.now()}`;
    console.log(filePath);

    // From example at:
    //https://github.com/angular/angularfire/blob/master/docs/storage.md
    const storageRef = ref(this.storage, filePath);
    uploadBytesResumable(storageRef, selectedImage).then(() => {
      getDownloadURL(storageRef).then(url => {
        postData.postImgPath = url;
      });
    });
  }
}
