class PrayerSlot {
    constructor(name, time) {
        this.name = name[0].toUpperCase() + name.slice(1).toLowerCase();
        this.time = time;
    }

    getTotalMinutes = (t) => {
        let tt = t.split(':');
        return tt[0] * 60 + tt[1] * 1;
    }

    isCurrent(current, start, end) {
        let t = this.getTotalMinutes(current);
        let s = this.getTotalMinutes(start);
        let e = this.getTotalMinutes(end);
    
        let r = false;
    
        if (e > s) {
            if (t >= s && t < e) {
                r = true;
            }
        }
        else {
            r = !this.isCurrent(current, end, start);
        }
    
        return r;
    
    }
}

class Node {
    constructor(value) {
        this.value = value
        this.next = null
    }
}

class CircularLinkedList {
    constructor(value) {
      this.head = null
      this.tail = null
      this.length = 0
      
      if (value) {
        this.initialize(value)
      }
    }
    
    initialize(value) {
        const newNode = new Node(value)
        newNode.next = newNode
        this.head = newNode
        this.tail = newNode
        this.length++
    }
        
    append(value) {
      if (this.length === 0) {
        return this.initialize(value)
      }
      const newNode = new Node(value)
      newNode.next = this.head
      this.tail.next = newNode
      this.tail = newNode
      this.length++
    }
    
    toArray() {
      const array = []
      let currentNode = this.head
  
      do {
          array.push(currentNode.value)
        currentNode = currentNode.next
      } while (currentNode !== this.head)
      
      return array
    }

    traverse(currentTime) {
      let counter = 0
      let currentNode = this.head
  
      while (!currentNode.value.isCurrent(currentTime, currentNode.value.time, currentNode.next.value.time)) {
        currentNode = currentNode.next
        counter++
      }
  
      return currentNode
    }
    
}

module.exports = {CircularLinkedList, PrayerSlot}