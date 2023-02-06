import { Component } from '@angular/core';
import { GraphComponent } from './graph/graph.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'testApp';
  text = 'this is an example card';
  text2 = 'this is another example card';
}
