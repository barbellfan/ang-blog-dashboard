import { Injectable } from '@angular/core';
import { FirebaseStorage, StorageModule } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private storage: StorageModule) { }

  uploadImage(selectedImage: any) {
    const filePath = `postIMG/${Date.now()}`;
    console.log(filePath);

  }
}
