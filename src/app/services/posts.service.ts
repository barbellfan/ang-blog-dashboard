import { Injectable, inject } from '@angular/core';
import * as fs from '@angular/fire/firestore';
import { Storage,ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Post } from '../models/post';
import { Firestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { FsCategory } from '../models/fs-category';

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

  async loadData(): Promise<FsCategory[]> {
    /* code from video
    return this.afs.collection('post').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data};
        })
      })
    );
    */

    const arr: FsCategory[] = []
    // taken from here: https://firebase.google.com/docs/firestore/query-data/get-data
    // Section titled: Get all documents in a subcollection
    const db = fs.collection(this.afs, 'posts');
    const querySnapshot: fs.QuerySnapshot<fs.DocumentData> = await fs.getDocs(db);
    querySnapshot.forEach((doc) => {
        const fsCat: FsCategory = {
          id: doc.id,
          category: doc.data()['category'] // use the indexer!!
      };
      arr.push(fsCat);
    });

    return arr;
  }

}
