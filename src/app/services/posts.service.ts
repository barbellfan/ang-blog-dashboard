import { Injectable, inject } from '@angular/core';
import * as fs from '@angular/fire/firestore';
import { Storage,ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Post } from '../models/post';
import { Firestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private storage: Storage = inject(Storage);

  constructor(
    private afs: Firestore,
    private toastr: ToastrService,
    private router: Router) { }

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

    this.router.navigate(['/posts']);
  }

  async loadData(): Promise<Post[]> {
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

    const arr: Post[] = []
    // taken from here: https://firebase.google.com/docs/firestore/query-data/get-data
    // Section titled: Get all documents in a subcollection
    const db = fs.collection(this.afs, 'posts');
    const querySnapshot: fs.QuerySnapshot<fs.DocumentData> = await fs.getDocs(db);
    querySnapshot.forEach((doc) => {
        let d: fs.DocumentData = doc.data();

        const p: Post = {
          title: d['title'],
          permalink: d['permalink'],
          category: d['category'].category,
          postImgPath: d['postImgPath'],
          excerpt: d['excerpt'],
          content: d['content'],
          isFeatured: d['isFeatured'],
          views: d['views'],
          status: d['status'],
          createdAt: d['createdAt'].toDate()
      };
      arr.push(p);
    });

    return arr;
  }

}
