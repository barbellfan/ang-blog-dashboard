import { Injectable, inject } from '@angular/core';
import { Storage,ref, uploadBytesResumable } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private storage: Storage = inject(Storage);

  constructor() { }

  uploadImage(selectedImage: any) {
    const filePath = `postIMG/${Date.now()}`;
    console.log(filePath);

    // From example at:
    //https://github.com/angular/angularfire/blob/master/docs/storage.md
    const storageRef = ref(this.storage, filePath);
    uploadBytesResumable(storageRef, selectedImage).then(() => {
      console.log("post image uploaded successfully");
    });
  }
}
