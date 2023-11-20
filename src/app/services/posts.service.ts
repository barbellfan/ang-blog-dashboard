import { Injectable, inject } from '@angular/core';
import * as fs from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Post } from '../models/post';
import { Firestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private storage: Storage = inject(Storage);

  constructor(
    private afs: Firestore,
    private toastr: ToastrService,
    private router: Router) { }

  uploadImage(selectedImage: any, postData: Post, formStatus: string, id: string) {
    const filePath = `postIMG/${Date.now()}`;

    // From example at:
    //https://github.com/angular/angularfire/blob/master/docs/storage.md
    const storageRef = ref(this.storage, filePath);
    uploadBytesResumable(storageRef, selectedImage).then(() => {
      getDownloadURL(storageRef).then(url => {
        postData.postImgPath = url;

        if (formStatus == 'Edit') {
          this.updateData(id, postData);
        } else {
          this.saveData(postData);
        }
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
          firebaseID: doc.id,
          title: d['title'],
          permalink: d['permalink'],
          category: {category: d['category'].category, categoryId: d['category'].categoryId},
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

  loadOneData(id: string): Observable<Post> {
    /* code from video that does not work
    return this.afs.doc(`posts/${id}`).valueChanges();
    */
   // idea from:
   // https://github.com/firebase/quickstart-js/blob/master/firestore/src/app/restuarant-page/restuarant-page.component.ts
    const docRef = fs.doc(this.afs, `posts/${id}`);
    return fs.docData(docRef) as Observable<Post>;
  }

  updateData(id: string, postData: Post) {
    /* code from video that doesn't work anymore
    this.afs.doc(`posts/${id}`).update(postData).then(() => {
      this.toastr.success('Data updated successfully');
    });
    */
    const docRef = fs.doc(this.afs, `posts/${id}`)
    fs.updateDoc(docRef, {
      category: {
        category: postData.category.category,
        categoryId: postData.category.categoryId
      },
      content: postData.content,
      createdAt: postData.createdAt,
      excerpt: postData.excerpt,
      isFeatured: postData.isFeatured,
      permalink: postData.permalink,
      postImgPath: postData.postImgPath,
      status: postData.status, // 'edited'?
      title: postData.title,
      views: postData.views
    }).then(() => {
      this.toastr.success('Data updated successfully');
      this.router.navigate(['/posts']);
    });
  }

  deleteImage(postImgPath: string, id: string) {
    /* code from video that doesn't work any more
    this.storage.storage.refFromURL(postImgPath).delete();
    */
    const storageRef = ref(this.storage, postImgPath);
    deleteObject(storageRef).then(() => {
      this.deleteData(id);
    }).catch((error) => {
      this.toastr.error("error deleting image: " + error);
    })
  }

  deleteData(id: string) {
    /* code from video that doesn't work anymore
    this.afs.doc(`posts/${id}`).delete().then(() => {
      this.toastr.warning("Data deleted");
    });
    */
    const docRef = fs.doc(this.afs, `posts/${id}`);
    fs.deleteDoc(docRef).then(() => {
      this.toastr.warning("Data deleted");
    });
  }

  markFeatured(id: string, featuredData: any) {
    // code from video that doesn't work has been elided.
    const docRef = fs.doc(this.afs, `posts/${id}`);
    fs.updateDoc(docRef, featuredData).then(() =>{
      this.toastr.info("Featured status updated");
    });
  }
}
