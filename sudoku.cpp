#include<bits/stdc++.h>
using namespace std;

void print(int board[][9], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cout << board[i][j] << "  ";
        }
        cout << endl;
    }
}

bool isValid(int board[][9], int i, int j, int num, int n) {
    // Row check
    for (int x = 0; x < n; x++) {
        if (board[i][x] == num) {
            return false;
        }
    }

    // Column check
    for (int x = 0; x < n; x++) {
        if (board[x][j] == num) {  // should check board[x][j] not board[x][i]
            return false;
        }
    }

    // Sub-Matrix Check
    int rn = sqrt(n);
    int si = i - (i % rn);
    int sj = j - (j % rn);

    for (int x = si; x < si + rn; x++) {
        for (int y = sj; y < sj + rn; y++) {
            if (board[x][y] == num) {  // should check board[x][y] not board[i][j]
                return false;
            }
        }
    }

    return true;
}

bool sudoku_solver(int board[][9], int i, int j, int n) {
    // Base Case
    if (i == n) {
        print(board, n);
        return true;
    }

    // If we are not inside the board
    if (j == n) {
        return sudoku_solver(board, i + 1, 0, n);
    }

    // If cell is already filled ->> just move forward
    if (board[i][j] != 0) {
        return sudoku_solver(board, i, j + 1, n);
    }

    for (int num = 1; num <= 9; num++) {
        if (isValid(board, i, j, num, n)) {
            board[i][j] = num;  // should use = not ==
            bool subAns = sudoku_solver(board, i, j + 1, n);

            if (subAns) {
                return true;
            }

            // Back-Tracking -->> Undo the change
            board[i][j] = 0;
        }
    }

    return false;
}

int main() {
    int n = 9;
    int board[9][9] = {
        {0, 0, 7, 1, 0, 0, 0, 6, 0},
        {1, 0, 5, 2, 0, 8, 0, 0, 0},
        {6, 0, 0, 0, 0, 7, 1, 2, 0},
        {3, 1, 2, 4, 0, 5, 0, 0, 8},
        {0, 0, 6, 0, 9, 0, 2, 0, 0},
        {0, 0, 0, 0, 0, 3, 0, 0, 1},
        {0, 0, 1, 0, 0, 4, 9, 8, 6},
        {8, 0, 3, 9, 0, 6, 0, 0, 0},
        {0, 6, 0, 0, 8, 2, 7, 0, 3}
    };

    sudoku_solver(board, 0, 0, n);

    return 0;
}
