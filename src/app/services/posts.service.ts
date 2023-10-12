import { Injectable, inject } from '@angular/core';
import * as fs from '@angular/fire/firestore';
import { Storage,ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Post } from '../models/post';
import { Firestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private storage: Storage = inject(Storage);

  constructor(private afs: Firestore, private toastr: ToastrService) { }

  uploadImage(selectedImage: any, postData: Post) {
    const filePath = `postIMG/${Date.now()}`;

    // From example at:
    //https://github.com/angular/angularfire/blob/master/docs/storage.md
    const storageRef = ref(this.storage, filePath);
    uploadBytesResumable(storageRef, selectedImage).then(() => {
      getDownloadURL(storageRef).then(url => {
        postData.postImgPath = url;
        this.saveData(postData);
      });
    });
  }

  saveData(postData: Post) {
    const db = fs.collection(this.afs, 'posts');
    fs.addDoc(db, postData)
    .then((documentReference: fs.DocumentReference) => {
      this.toastr.success('Data inserted successfully. ID: ' + documentReference.id);
    })
    .catch(error => {
      this.toastr.error('Error saving data: ' + error);
    });

    /*
    Code from video which is obsolete:
    this.afs.collection('posts').add(postData).then(docRef => {
      this.toastr.success('Data inserted successfully');
    });
    */
  }
}
